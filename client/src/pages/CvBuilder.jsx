import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';
import axios from 'axios';
import { toast } from 'react-toastify';

const CVBuilder = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const navigate = useNavigate();
  
  // État pour les sections du CV
  const [cvData, setCvData] = useState({
    summary: '',
    contactInfo: '',
    skills: [],
    experiences: [],
    educations: [],
    languages: [],
    projects: []
  });

  // État pour les formulaires
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Débutant', yearOfExperience: 0 });
  const [newExperience, setNewExperience] = useState({
    name: '',
    description: '',
    yearOfExperience: 0
  });

  const handleAddSkill = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/cv/skills`, {
        userId: userData._id,
        item: newSkill
      });
      
      setCvData({
        ...cvData,
        skills: [...cvData.skills, response.data]
      });
      setNewSkill({ name: '', level: 'Débutant', yearOfExperience: 0 });
      toast.success('Compétence ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la compétence');
    }
  };

  const handleAddExperience = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/cv/professional-experiences`, {
        userId: userData._id,
        item: newExperience
      });
      
      setCvData({
        ...cvData,
        experiences: [...cvData.experiences, response.data]
      });
      setNewExperience({ name: '', description: '', yearOfExperience: 0 });
      toast.success('Expérience ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'expérience');
    }
  };

  const handleSaveCV = async () => {
    try {
      await axios.post(`${backendUrl}/api/cv`, {
        userId: userData._id,
        ...cvData
      });
      toast.success('CV sauvegardé avec succès');
      navigate('/preview');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du CV');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Créateur de CV</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ajouter des sections</h2>
            
            {/* Compétences */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Compétences</h3>
              <input
                type="text"
                placeholder="Nom de la compétence"
                className="w-full p-2 border rounded mb-2"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded mb-2"
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
              <input
                type="number"
                placeholder="Années d'expérience"
                className="w-full p-2 border rounded mb-2"
                value={newSkill.yearOfExperience}
                onChange={(e) => setNewSkill({...newSkill, yearOfExperience: e.target.value})}
              />
              <button 
                onClick={handleAddSkill}
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
            
            {/* Expériences professionnelles */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Expériences professionnelles</h3>
              <input
                type="text"
                placeholder="Poste"
                className="w-full p-2 border rounded mb-2"
                value={newExperience.name}
                onChange={(e) => setNewExperience({...newExperience, name: e.target.value})}
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded mb-2"
                rows="3"
                value={newExperience.description}
                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
              ></textarea>
              <input
                type="number"
                placeholder="Années d'expérience"
                className="w-full p-2 border rounded mb-2"
                value={newExperience.yearOfExperience}
                onChange={(e) => setNewExperience({...newExperience, yearOfExperience: e.target.value})}
              />
              <button 
                onClick={handleAddExperience}
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
            
            <button 
              onClick={handleSaveCV}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
            >
              Sauvegarder le CV
            </button>
          </div>
          
          {/* Aperçu du CV */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Aperçu de votre CV</h2>
            
            <div className="space-y-6">
              {/* En-tête */}
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">{userData?.name} {userData?.lastname}</h1>
                <p className="text-gray-600">{cvData.contactInfo || 'Votre email et téléphone'}</p>
              </div>
              
              {/* Résumé */}
              {cvData.summary && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 border-b pb-1">Profil</h2>
                  <p>{cvData.summary}</p>
                </div>
              )}
              
              {/* Compétences */}
              {cvData.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 border-b pb-1">Compétences</h2>
                  <ul className="grid grid-cols-2 gap-2">
                    {cvData.skills.map((skill, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{skill.name}</span>
                        <span className="text-gray-500">{skill.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Expériences */}
              {cvData.experiences.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2 border-b pb-1">Expériences professionnelles</h2>
                  {cvData.experiences.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-medium">{exp.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">{exp.yearOfExperience} ans d'expérience</p>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;