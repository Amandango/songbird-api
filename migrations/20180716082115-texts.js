'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, done) {
  db.createTable('texts', {
    id: {
      type: 'int',
      primaryKey: 'true',
      autoIncrement: 'true'
    },

    momentText: {
      type: 'string',
      notNull: true
    },

    momentTitle: {
      type: 'string',
      notNull: true
    },

    createdOn: {
      type: 'string',
      notNull: true
    },

    userId: {
      type: 'int',
      notNull: true,
      // foreignKey: {
      //   name: 'userIdTexts',
      //   table: 'users',
      //   rules: {
      //     onDelete: 'CASCADE',
      //     onUpdate: 'RESTRICT'
      //   },
      //   mapping: 'id'
      // }
    },

  }, done);
};

exports.down = function(db, done) {
  db.dropTable('texts', done)
};

exports._meta = {
  "version": 1
};
