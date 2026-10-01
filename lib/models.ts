import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, minimize: false },
)

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: { type: String, default: "coming-soon" },
  },
  { timestamps: true },
)

const messageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, default: "", trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
)

const sessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
)

function model<T extends Schema>(name: string, schema: T) {
  return (mongoose.models[name] as Model<InferSchemaType<T>>) ?? mongoose.model(name, schema)
}

export const Setting = model("Setting", settingSchema)
export const Subscriber = model("Subscriber", subscriberSchema)
export const Message = model("Message", messageSchema)
export const Admin = model("Admin", adminSchema)
export const Session = model("Session", sessionSchema)
