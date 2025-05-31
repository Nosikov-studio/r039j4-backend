module.exports.login = function(req, res) {
    res.status(200).json({
        login: "truefromcontroller"
    })
}

module.exports.register = function(req, res) {
    res.status(200).json({
        register: "truefromcontrollerrrrr"
    })
}