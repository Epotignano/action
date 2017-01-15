exports.up = async(r) => {
  const tables = [
    r.tableCreate('InactiveUser'),
  ];
  try {
    await Promise.all(tables);
  } catch (e) {
  }
  const indices = [
    r.table('InactiveUser').indexCreate('userId')
  ];
  try {
    await Promise.all(indices);
  } catch (e) {
  }
};

exports.down = async(r) => {
  const tables = [
    r.tableDrop('InactiveUser'),
  ];
  await Promise.all(tables);
};