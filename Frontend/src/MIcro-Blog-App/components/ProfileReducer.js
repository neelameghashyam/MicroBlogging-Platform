
const ProfileReducer = (state, action) => {
    switch (action.type) {
      case "GET":
        return [action.payload];
      case "EDIT":
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      default:
        return state;
    }
  };
  
  export default ProfileReducer
  