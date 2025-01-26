import prisma from "lib/prisma";

const useClientInfo = async () => {
  const client = await prisma.clientConfiguration.findFirst();
  return JSON.stringify(client);
};
export default useClientInfo;
