const Urgence = require('../../models/urgence/urgence');
const { Socket } = require('../../utils/socketjs');

exports.create = async (req, res) => {
    const response = await Urgence.findOne({ latitude: req.body.latitude, longitude: req.body.longitude })
    if (response === null) {
        const newUrgence = new Urgence({
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            type: req.body.type,
            taille: req.body.taille,
            age: req.body.age,
            niveau: req.body.niveau,
            nbrpersonne: req.body.nbrpersonne,
            depart: req.body.depart,
            nomprenom: req.body.nomprenom,
            distance: req.body.distance,
            status: req.body.status,
            tel: req.body.tel,
            communication: req.body.communication,
            police: req.body.police,
            cloture: 'false'
        });
        newUrgence.save()
            .then((urgence) => {
                Socket.emit('notification', {
                    urgence
                });
                res.send({ message: "Urgence was created successfully.", urgence })

            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred."
                });
            });
    } else {
        Urgence.findByIdAndUpdate(response._id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update with id=${response._id}. Maybe was not found!`
                    });
                } else {
                    Socket.emit('refresh', { data: data });
                    res.send({ message: "Urgence was updated successfully." });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating urgence with id=" + response._id + " " + err
                });
            });
    }


}

exports.findAll = async (req, res) => {
    const { depart, niveau, status, cloture } = req.query
    try {
        const query = {};
        if (depart) query.depart = new RegExp(depart, 'i');
        if (niveau) query.niveau = niveau;
        if (status) query.status = new RegExp(status, 'i');
        if (cloture) query.cloture = cloture;
        const urgences = await Urgence.find(query);
        res.send(urgences)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.findUrgence = (req, res) => {
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;

    Urgence.findOne({ latitude: latitude, longitude: longitude })
        .then(
            data => {
                res.send(data);
                return;
            })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while fetching data."
            });
        })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Urgence.findByIdAndRemove(id)
        .then(async (data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Urgence with id=${id}. Maybe Urgence was not found!`
                });
            } else {
                res.send({
                    message: "Urgence was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Urgence with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Urgence.deleteMany()
        .then(async (data) => {
            res.send({ message: `${data.deletedCount} Urgence(s) were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all urgences."
            });
        });
};

exports.findNbrMonthly = async (req, res) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let data = []
    for (let index = 0; index < months.length; index++) {
        const response = await Urgence.find({
            $expr: {
                $eq: [
                    { $month: "$createdAt" }, months[index]
                ]
            }
        })
        data.push(response.length)
    }
    res.send({ message: data })
};

exports.findNbrDaily = async (req, res) => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const daysInMonth = getDaysInMonth(year, month);
    let tabDays = []
    for (let index = 0; index < daysInMonth; index++) {
        tabDays.push(index + 1)
    }
    let data = []
    for (let index = 0; index < tabDays.length; index++) {
        const targetDate = new Date(`${year}-${month}-${tabDays[index]}`);
        const response = await Urgence.find({
            $expr: {
                $eq: [
                    { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    { $dateToString: { format: "%Y-%m-%d", date: targetDate } }
                ]
            }
        })
        if (response.length > 0) {
            data.push(response.length)
        }
        else {
            data.push(0)
        }
    }
    res.send({
        days: tabDays,
        data: data
    })
};

exports.findByRegion = async (req, res) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let data = []
    for (let index = 0; index < months.length; index++) {
        const response = await Urgence.find({})
        data.push(response.length)
    }
    res.send({ message: data })
}

function getDaysInMonth(year, month) {
    // JavaScript months are zero-based (0 - January to 11 - December)
    // So, we subtract 1 from the provided month to get the correct month index.
    const date = new Date(year, month - 1, 1);

    // Move to the next month and subtract 1 day to get the last day of the provided month.
    date.setMonth(date.getMonth() + 1);
    date.setDate(date.getDate() - 1);

    // Return the day of the last date, which represents the number of days in the month.
    return date.getDate();
}




