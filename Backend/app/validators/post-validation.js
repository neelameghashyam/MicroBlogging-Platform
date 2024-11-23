import Post from "../models/post-model.js";
export const postSchemaValidation = {
  user: {
    exists: {
      errorMessage: "User field is required"
    },
    notEmpty: {
      errorMessage: "User ID cannot be empty"
    },
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB ObjectId"
    }
  },
  body: {
    exists: {
      errorMessage: "Body field is required"
    },
    notEmpty: {
      errorMessage: "Body cannot be empty"
    },
    isString: {
      errorMessage: "Body must be a string"
    },
    trim: true,
    isLength: {
      options: { min: 1, max: 5000 },
      errorMessage: "Body must be between 1 and 5000 characters"
    }
  },
  keywords: {
    exists: {
      errorMessage: "Keywords field is required"
    },
    notEmpty: {
      errorMessage: "Keywords cannot be empty"
    },
    isString: {
      errorMessage: "Keywords must be a string"
    },
    trim: true,
    isLength: {
      options: { max: 255 },
      errorMessage: "Keywords cannot be longer than 255 characters"
    }
  },
  comments: {
    optional: true,
    isArray: {
      errorMessage: "Comments must be an array"
    },
    custom: {
      options: (value) => Array.isArray(value) && value.every((comment) => commentSchemaValidation(comment)),
      errorMessage: "Each comment must be a valid comment object"
    }
  },
  likes: {
    optional: true,
    isArray: {
      errorMessage: "Likes must be an array"
    }
  }
};

export const commentSchemaValidation = {
  title: {
    exists: {
      errorMessage: "Title field is required"
    },
    notEmpty: {
      errorMessage: "Title cannot be empty"
    },
    isString: {
      errorMessage: "Title must be a string"
    },
    trim: true,
    isLength: {
      options: { min: 1, max: 255 },
      errorMessage: "Title must be between 1 and 255 characters"
    }
  },
  body: {
    exists: {
      errorMessage: "Body field is required"
    },
    notEmpty: {
      errorMessage: "Body cannot be empty"
    },
    isString: {
      errorMessage: "Body must be a string"
    },
    trim: true,
    isLength: {
      options: { min: 1, max: 5000 },
      errorMessage: "Body must be between 1 and 5000 characters"
    }
  },
  user: {
    exists: {
      errorMessage: "User field is required"
    },
    notEmpty: {
      errorMessage: "User ID cannot be empty"
    },
    isMongoId: {
      errorMessage: "User ID must be a valid MongoDB ObjectId"
    }
  }
};
