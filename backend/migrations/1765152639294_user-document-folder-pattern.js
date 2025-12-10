/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('folders', {
    id: 'id',
    name: { type: 'text', notNull: true },
    stored_documents: { type: 'integer[]' },
    nested_folders: { type: 'integer[]' },
  });

  pgm.createTable('documents', {
    id: 'id',
    name: { type: 'text', notNull: true },
    text: { type: 'text' },
  });

  pgm.addColumn('users', {
    root_folder: {
      type: 'integer',
      references: '"folders"',
      onDelete: 'set null',
    },
  });
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('folders');
    pgm.dropTable('documents');
    pgm.dropColumn('users', ['root_folder']);
};

