import UsersService from "./users.service";


const UsersController = {
  getUsers: async () => {
    try {
      const users = await UsersService.getUsers();
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Error retrieving users");
    }
  },
  retrieveUser: async (ID: string) => {
    try {
      const users = await UsersService.retrieveUser(ID);
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Error retrieving user");
    }
  },
};

export default UsersController;
