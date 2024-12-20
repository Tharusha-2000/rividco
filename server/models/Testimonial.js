const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true }, // URL to the image
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
