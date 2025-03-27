import express from 'express';
import {cvController} from '../controllers/cvController.js';
import userAuth from '../middleware/userAuth.js';

const cvRouter = express.Router();

// Protéger toutes les routes avec l'authentification
cvRouter.use(userAuth);

// Routes génériques
cvRouter.post('/', cvController.createOrUpdateCV);
cvRouter.get('/:userId', cvController.getCV);
cvRouter.post('/add-item', cvController.addSectionItem);
cvRouter.put('/update-item', cvController.updateSectionItem);
cvRouter.delete('/remove-item', cvController.removeSectionItem);
cvRouter.put('/info', cvController.updateCVInfo);
cvRouter.delete('/', cvController.deleteCV);

// Routes spécifiques par section
cvRouter.post('/skills', cvController.addSkill);
cvRouter.post('/professional-experiences', cvController.addProfessionalExperience);
cvRouter.post('/educations', cvController.addEducation);
cvRouter.post('/languages', cvController.addLanguage);
cvRouter.post('/interests', cvController.addInterest);
cvRouter.post('/projects', cvController.addProject);
cvRouter.post('/certifications', cvController.addCertification);
cvRouter.post('/others', cvController.addOther);

export default cvRouter;