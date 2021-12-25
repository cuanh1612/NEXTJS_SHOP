import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, 
        default: "user"
    },
    root: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "https://avatars.dicebear.com/api/micah/:default.svg"
    }
}, {
    timestamps: true
})

export default  mongoose.models.users || mongoose.model('users', userSchema)