import CV from '../models/cvModel.js';

// Contrôleur pour le CV
export const cvController = {
  // Créer ou mettre à jour un CV
  createOrUpdateCV: async (req, res) => {
    try {
      const { userId, ...cvData } = req.body;
      
      // Validation de l'userId
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const options = { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true 
      };
      
      const cv = await CV.findOneAndUpdate(
        { userId }, 
        { ...cvData, updatedAt: Date.now() }, 
        options
      );
      
      res.status(200).json(cv);
    } catch (error) {
      console.error('Error in createOrUpdateCV:', error);
      res.status(500).json({ 
        message: 'Failed to create or update CV',
        error: error.message 
      });
    }
  },

  // Obtenir un CV par userId
  getCV: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const cv = await CV.findOne({ userId })
        .populate('userId', '-password') // Exclure le mot de passe
        .lean();
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      res.status(200).json(cv);
    } catch (error) {
      console.error('Error in getCV:', error);
      res.status(500).json({ 
        message: 'Failed to get CV',
        error: error.message 
      });
    }
  },

  // Méthode générique pour ajouter un élément à une section
  addSectionItem: async (req, res) => {
    try {
      const { userId, section, item } = req.body;
      
      if (!userId || !section || !item) {
        return res.status(400).json({ 
          message: 'User ID, section and item are required' 
        });
      }
      
      // Vérifier que la section existe dans le modèle
      if (!CV.schema.path(section)) {
        return res.status(400).json({ message: 'Invalid section' });
      }
      
      const cv = await CV.findOneAndUpdate(
        { userId },
        { 
          $push: { [section]: item },
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      );
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      res.status(200).json(cv);
    } catch (error) {
      console.error(`Error in addSectionItem for ${section}:`, error);
      res.status(500).json({ 
        message: `Failed to add item to ${section}`,
        error: error.message 
      });
    }
  },

  // Méthode générique pour mettre à jour un élément dans une section
  updateSectionItem: async (req, res) => {
    try {
      const { userId, section, itemId, updatedItem } = req.body;
      
      if (!userId || !section || !itemId || !updatedItem) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }
      
      const cv = await CV.findOne({ userId });
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      const itemIndex = cv[section].findIndex(item => item._id.equals(itemId));
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in section' });
      }
      
      // Créer un objet pour la mise à jour dynamique
      const updateQuery = {};
      for (const key in updatedItem) {
        updateQuery[`${section}.$.${key}`] = updatedItem[key];
      }
      
      const updatedCV = await CV.findOneAndUpdate(
        { 
          userId, 
          [`${section}._id`]: itemId 
        },
        { 
          $set: { 
            ...updateQuery,
            updatedAt: Date.now() 
          } 
        },
        { new: true }
      );
      
      res.status(200).json(updatedCV);
    } catch (error) {
      console.error(`Error in updateSectionItem for ${section}:`, error);
      res.status(500).json({ 
        message: `Failed to update item in ${section}`,
        error: error.message 
      });
    }
  },

  // Méthode générique pour supprimer un élément d'une section
  removeSectionItem: async (req, res) => {
    try {
      const { userId, section, itemId } = req.body;
      
      if (!userId || !section || !itemId) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }
      
      const cv = await CV.findOneAndUpdate(
        { userId },
        { 
          $pull: { 
            [section]: { _id: itemId } 
          },
          $set: { updatedAt: Date.now() }
        },
        { new: true }
      );
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      res.status(200).json(cv);
    } catch (error) {
      console.error(`Error in removeSectionItem for ${section}:`, error);
      res.status(500).json({ 
        message: `Failed to remove item from ${section}`,
        error: error.message 
      });
    }
  },

  // Mettre à jour les informations de base du CV
  updateCVInfo: async (req, res) => {
    try {
      const { userId, ...updateData } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const cv = await CV.findOneAndUpdate(
        { userId },
        { 
          ...updateData,
          updatedAt: Date.now() 
        },
        { new: true }
      );
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      res.status(200).json(cv);
    } catch (error) {
      console.error('Error in updateCVInfo:', error);
      res.status(500).json({ 
        message: 'Failed to update CV info',
        error: error.message 
      });
    }
  },

  // Supprimer complètement un CV
  deleteCV: async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const cv = await CV.findOneAndDelete({ userId });
      
      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }
      
      res.status(200).json({ 
        message: 'CV deleted successfully',
        deletedCV: cv 
      });
    } catch (error) {
      console.error('Error in deleteCV:', error);
      res.status(500).json({ 
        message: 'Failed to delete CV',
        error: error.message 
      });
    }
  },

  // Méthodes spécifiques pour chaque section (version optimisée utilisant addSectionItem)

  // Compétences
  addSkill: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'skills'
      }
    }, res);
  },

  // Expériences professionnelles
  addProfessionalExperience: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'professionalExperiences'
      }
    }, res);
  },

  // Formations
  addEducation: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'educations'
      }
    }, res);
  },

  // Langues
  addLanguage: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'languages'
      }
    }, res);
  },

  // Centres d'intérêt
  addInterest: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'interests'
      }
    }, res);
  },

  // Projets
  addProject: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'projects'
      }
    }, res);
  },

  // Certifications
  addCertification: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'certifications'
      }
    }, res);
  },

  // Autres
  addOther: async (req, res) => {
    await cvController.addSectionItem({
      ...req,
      body: {
        ...req.body,
        section: 'others'
      }
    }, res);
  }
};