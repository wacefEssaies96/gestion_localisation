const Urgence = require('../../models/urgence/urgence');
const { Socket, io, triggerEmitEvent } = require('../../utils/socketjs');

exports.create = async (req, res) => {
    let response = await Urgence.findOne({ latitude: req.body.latitude, longetude: req.body.longetude })
    // res.send({response: response})
    if (response == null) {
        // Create a article
        const newUrgence = new Urgence({
            longetude: req.body.longetude,
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
            police: req.body.police
        });
        newUrgence.save()
            .then((urgence) => {
                triggerEmitEvent('notification', {
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
                    triggerEmitEvent('refresh', { data: data });
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

exports.findAll = (req, res) => {
    Urgence.find()
        .then(data => {
            res.send(data);
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while fetching data."
            });
        })
}

exports.findUrgence = (req, res) => {
    const latitude = req.params.latitude;
    const longetude = req.params.longetude;

    Urgence.findOne({ latitude: latitude, longetude: longetude })
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


// exports.searchArticle = async (req, res) => {
//     const { query, page, limit = 10 } = req.query
//     const options = {
//         page,
//         limit,
//         collation: {
//             locale: 'en'
//         }
//     }
//     const regexQuery = new RegExp(query, 'i')
//     try {
//         const articles = await Article.paginate(
//             { title: regexQuery, status: 'published' },
//             options
//         )
//         res.json(articles)
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }

// Delete a article with the specified id in the request
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

// Delete all articles from the database.
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




