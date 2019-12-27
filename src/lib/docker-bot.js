const { Docker } = require("docker-cli-js");

const docker = new Docker();

const ps = async (id, name, username) => {
  if (id !== parseInt(process.env.MYID)) {
    const text = `${name}-${username} voce nao tem acesso!`;
    return text;
  }
  const data = await docker.command("ps");
  return data.raw;
};

module.exports = {
  ps
};
