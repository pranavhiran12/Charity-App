const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    name: { type: String, required: true },
    email: {
        type: String,
        validate: {
            validator: (v) => /^.+@.+\..+$/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    }, // optionally make this required
    rsvp: {
        type: String,
        enum: ["Yes", "No", "Maybe"],
        default: "Maybe"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mobile: {
        type: String,
        validate: {
            validator: (v) => /^(\+?\d{10,15})$/.test(v),
            message: props => `${props.value} is not a valid mobile number!`
        }
    },

    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending'
    }
}, { timestamps: true });

// Index to prevent duplicate guests per event/user/email combo
guestSchema.index({ userId: 1, eventId: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } });

module.exports = mongoose.model("Guest", guestSchema);