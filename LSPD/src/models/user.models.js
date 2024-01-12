module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		discord_id: {
			type: DataTypes.STRING,
			defaultValue: '0',
		},
		license: {
			type: DataTypes.STRING,
			defaultValue: '0',
		},
		twitch_id: {
			type: DataTypes.STRING,
			defaultValue: '0',
		},
		discord_username: {
			type: DataTypes.STRING,
			defaultValue: '0',
		},
		birthday: DataTypes.DATE,
		disable: {
			type: DataTypes.BOOLEAN,
			default: false,
		},
		created_at: DataTypes.DATE,
		updated_at: DataTypes.DATE,
		game_firstname: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		game_lastname: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		role: DataTypes.STRING,
		statut: DataTypes.STRING,
	}, {
		tableName: 'user',
		timestamps: false,
	});
};
