import mongoose, { Schema, model, models } from "mongoose";

const RequestSchema = new Schema({
    businessName: {
        type: String,
        required: [true, "Business name is required"],
    },
    serviceType: {
        type: String,
        required: [true, "Service type is required"],
    },
    budget: {
        type: String,
        required: [true, "Budget is required"],
    },
    whatsapp: {
        type: String,
        required: [true, "WhatsApp number is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "new",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Request = models.Request || model("Request", RequestSchema);

export default Request;
