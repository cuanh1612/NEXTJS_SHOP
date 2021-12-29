import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

export default  mongoose.models.categories || mongoose.model('categories', categorySchema)