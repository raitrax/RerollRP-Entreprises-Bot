module.exports = (sequelize, DataTypes) => {
	return sequelize.define('statusmsg', {
		id_message: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};
