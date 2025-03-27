import mongoose from "mongoose";


const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  yearOfExperience: { type: Number, required: true }
});

const ProfessionalExperienceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    yearOfExperience: { type: Number, required: true }
  });


const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  isCurrent: { type: Boolean, default: false }
});

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true }
});

const interestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
  });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  technologiesUsed: [{ type: String }]
});


const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Organization: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date }
});

const otherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true}
  });

const cvSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String },
  contactInfo: { type: String },
  isPublic: { type: Boolean, default: false },
  ProfessionalExperience: [ProfessionalExperienceSchema],
  skills: [skillSchema],
  interest: [interestSchema],
  educations: [educationSchema],
  languages: [languageSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  other: [otherSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const CV = mongoose.model('CV', cvSchema);
export default CV;
