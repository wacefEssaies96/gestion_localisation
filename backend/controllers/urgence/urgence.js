const Urgence = require('../../models/urgence/urgence');
const { Socket } = require('../../utils/socketjs');
const pointInPolygon = require('point-in-polygon')
const turf = require('@turf/turf');
const mongoose = require('mongoose')

const { bizerteTunisCoordinates,
    tunisMonastirCoordinates,
    monastirGabesCoordinates,
    gabesZerzisCoordinates,
    tabarkaBizerteCoordinates,
    tabarkacapbonCoordinates } = require('../../utils/polygonData') // coords of areas

exports.create = async (req, res) => {
    let response = null
    if (req.body.id != null) {
        const id = req.body.id.replace(/^"|"$/g, '');
        response = await Urgence.findById(id)
    }
    if (!response) {
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
            cloture: 'false',
            other: req.body.other
        });
        newUrgence.save()
            .then((urgence) => {
                Socket.emit('notification', {
                    urgence
                });
                res.send(urgence._id)

            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred."
                });
            });
    }
    else { // if we retrieve the emergencie we simply update it
        Urgence.findByIdAndUpdate(response._id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update with id=${response._id}. Maybe it was not found!`
                    });
                } else {
                    Socket.emit('refresh', { data: data });
                    res.send({ message: "Emergency was updated successfully." });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating emergency with id=" + response._id + " " + err
                });
            });
    }
}
// retrive all emergencies with filters
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
// retrieve emergency by coords
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
                    message: `Cannot delete emergency with id=${id}. Maybe it was not found!`
                });
            } else {
                res.send({
                    message: "Emergency was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete emergency with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Urgence.deleteMany()
        .then(async (data) => {
            res.send({ message: `${data.deletedCount} Emergency(ies) were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all emergencies."
            });
        });
};
// Retreive emergencies monthly
exports.findNbrMonthly = async (req, res) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] //Months
    let data = []
    let enclosed = []
    let notEnclosed = []
    for (let index = 0; index < months.length; index++) { // retriving every emergencies per month
        const response = await Urgence.find({
            $expr: {
                $eq: [
                    { $month: "$createdAt" }, months[index]
                ]
            }
        })
        const counters = calculateEnclosed(response) // calculating how many is enclosed and not enclosed
        notEnclosed.push(counters.counterNotEnclosed)
        enclosed.push(counters.counterEnclosed);
        data.push(response.length)
    }
    res.send(
        {
            data: data,
            enclosed: enclosed,
            notEnclosed: notEnclosed
        }
    )
};

exports.findNbrDaily = async (req, res) => {
    const d = new Date(); // actual date
    const year = d.getFullYear(); // retrieve the actual year
    const month = d.getMonth() + 1; // retrieve the actual month
    const daysInMonth = getDaysInMonth(year, month); // retrieving how many days in this actual month in the year
    let tabDays = []
    for (let index = 0; index < daysInMonth; index++) { // filling an array with number of days
        tabDays.push(index + 1)
    }
    let data = []
    let enclosed = []
    let notEnclosed = []
    for (let index = 0; index < tabDays.length; index++) { // retrieving emergencies per day
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
        const counters = calculateEnclosed(response)
        notEnclosed.push(counters.counterNotEnclosed)
        enclosed.push(counters.counterEnclosed);
    }
    res.send({
        days: tabDays,
        data: data,
        enclosed: enclosed,
        notEnclosed: notEnclosed
    })
};

exports.findByRegion = async (req, res) => {
    const response = await Urgence.find()
    let region = ""
    let tabarka = 0
    let capBon = 0
    let monastir = 0
    let gabes = 0
    let zarzis = 0
    const polygontabarka = turf.polygon(tabarkacapbonCoordinates);
    const polygoncapbon = turf.polygon(tunisMonastirCoordinates);
    const polygonmonastir = turf.polygon(monastirGabesCoordinates);
    const polygongabes = turf.polygon(gabesZerzisCoordinates);

    for (let index = 0; index < response.length; index++) {
        const element = response[index];
        const point = turf.point([element.longitude, element.latitude]);
        if (turf.booleanPointInPolygon(point, polygontabarka)) {
            tabarka += 1
            region = 'Tabarka - Cap con'
            break
        }
        if (turf.booleanPointInPolygon(point, polygoncapbon)) {
            capBon += 1
            region = 'Cap bon - Monastir'
            break
        }
        if (turf.booleanPointInPolygon(point, polygonmonastir)) {
            monastir += 1
            region = 'Monastir - Gabes'
            break
        }
        if (turf.booleanPointInPolygon(point, polygongabes)) {
            gabes++
            region = 'Gabes - zarzis'
            break
        }
    }
    res.send({
        data: {
            tabarka: tabarka,
            capBon: capBon,
            monastir: monastir,
            gabes: gabes
        }
    })
}

exports.isInRegion = async (req, res) => {
    const point = turf.point([req.body.longitude, req.body.latitude]);
    const polygons = [
        turf.polygon(tabarkacapbonCoordinates),
        turf.polygon(tunisMonastirCoordinates),
        turf.polygon(monastirGabesCoordinates),
        turf.polygon(gabesZerzisCoordinates)
    ];

    if (polygons.some(polygon => turf.booleanPointInPolygon(point, polygon))) {
        return res.send(true);
    }

    return res.send(false);

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

function calculateEnclosed(data) {
    let counterEnclosed = 0
    let counterNotEnclosed = 0
    for (let jindex = 0; jindex < data.length; jindex++) {
        (data[jindex] && data[jindex].cloture === 'true') ? counterEnclosed += 1 : counterNotEnclosed += 1
    }
    return { counterEnclosed: counterEnclosed, counterNotEnclosed: counterNotEnclosed }
}




