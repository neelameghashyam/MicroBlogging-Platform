const proflieSchema = {
  userName: {
    exists: {
      errorMessage: "userName field is required"
    },
    notEmpty: {
      errorMessage: "userName can't be empty"
    },
    isString: {
      errorMessage: "userName must be a string"
    },
    trim: true,
    isLength: {
      options: { min: 3, max: 30 },
      errorMessage: "userName must be between 3 and 30 characters"
    },
    
  },
  bio: {
    optional: true,
    isString: {
      errorMessage: "bio must be a string"
    },
    trim: true,
    isLength: {
      options: { max: 500 },
      errorMessage: "bio cannot be longer than 500 characters"
    }
  },
  followers: {
    optional: true,
    isArray: {
      errorMessage: "followers must be an array"
    }
  },
  following: {
    optional: true,
    isArray: {
      errorMessage: "following must be an array"
    }
  }
};

export default proflieSchema;
