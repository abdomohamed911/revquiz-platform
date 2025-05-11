import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  score: {
    quizzes: {
      passed: {
        count: number;
        quizzes: Array<{
          id: Schema.Types.ObjectId;
          name: string;
        }>;
      };
      failed: {
        count: number;
        quizzes: Array<{
          id: Schema.Types.ObjectId;
          name: string;
        }>;
      };
    };
    questions: {
      passed: {
        count: number;
        questions: Array<{
          id: Schema.Types.ObjectId;
          text: string;
        }>;
      };
      failed: {
        count: number;
        questions: Array<{
          id: Schema.Types.ObjectId;
          text: string;
        }>;
      };
    };
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  score: {
    quizzes: {
      passed: {
        count: {
          type: Number,
          default: 0,
        },
        quizzes: [
          {
            id: {
              type: Schema.Types.ObjectId,
              ref: "Quiz",
            },
            name: {
              type: String,
            },
          },
        ],
      },
      failed: {
        count: {
          type: Number,
          default: 0,
        },
        quizzes: [
          {
            id: {
              type: Schema.Types.ObjectId,
              ref: "Quiz",
            },
            name: {
              type: String,
            },
          },
        ],
      },
    },
    questions: {
      passed: {
        count: {
          type: Number,
          default: 0,
        },
        questions: [
          {
            id: {
              type: Schema.Types.ObjectId,
              ref: "Question",
            },
            text: {
              type: String,
            },
          },
        ],
      },
      failed: {
        count: {
          type: Number,
          default: 0,
        },
        questions: [
          {
            id: {
              type: Schema.Types.ObjectId,
              ref: "Question",
            },
            text: {
              type: String,
            },
          },
        ],
      },
    },
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual field for overall score
UserSchema.virtual("score.overall").get(function () {
  const quizzesPassed = this.score.quizzes.passed.count || 0;
  const quizzesFailed = this.score.quizzes.failed.count || 0;
  const questionsPassed = this.score.questions.passed.count || 0;
  const questionsFailed = this.score.questions.failed.count || 0;

  return {
    passed: quizzesPassed + questionsPassed,
    failed: quizzesFailed + questionsFailed,
  };
});

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
export default UserModel;
