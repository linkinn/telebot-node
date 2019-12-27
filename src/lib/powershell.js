const Shell = require("node-powershell");

const ps = new Shell({
  executionPolicy: "Bypass",
  noProfile: true
});

const commander = async (command, id, name, username) => {
  if (id !== parseInt(process.env.MYID)) {
    const text = `${name}-${username} voce nao tem *acesso!*`;
    return text;
  }
  try {
    ps.addCommand(command);
    const result = await ps.invoke();
    return result;
  } catch (err) {
    return err;
  }
};

module.exports = commander;
