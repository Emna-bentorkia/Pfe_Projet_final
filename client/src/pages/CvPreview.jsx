import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContent';
import axios from 'axios';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';

const CVPreview = () => {
  const { backendUrl, userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/cv/${userData._id}`);
        setCvData(response.data);
      } catch (error) {
        toast.error('Erreur lors du chargement du CV');
        navigate('/builder');
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?._id) {
      fetchCV();
    } else {
      navigate('/login');
    }
  }, [userData, navigate, backendUrl]);

  const handleDownload = () => {
    const element = document.getElementById('cv-template');
    const opt = {
      margin: 10,
      filename: `CV_${userData.name}_${userData.lastname}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!cvData) {
    return <div className="min-h-screen flex items-center justify-center">Aucun CV trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Aperçu de votre CV</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/builder')}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Modifier
            </button>
            <button 
              onClick={handleDownload}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Télécharger PDF
            </button>
          </div>
        </div>
        
        {/* Template du CV */}
        <div id="cv-template" className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">{userData.name} {userData.lastname}</h1>
              <p className="text-gray-600">{userData.email} | {userData.numeroPhone}</p>
              <p className="text-gray-600">{userData.adress}</p>
            </div>
            {userData.dateBirth && (
              <p className="text-gray-500">
                Né(e) le: {new Date(userData.dateBirth).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {/* Profil */}
          {cvData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Profil</h2>
              <p className="text-gray-700">{cvData.summary}</p>
            </div>
          )}
          
          {/* Compétences */}
          {cvData.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Compétences</h2>
              <div className="grid grid-cols-2 gap-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(['Débutant', 'Intermédiaire', 'Avancé', 'Expert'].indexOf(skill.level) + 1) * 25}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Expériences professionnelles */}
          {cvData.professionalExperiences?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Expériences professionnelles</h2>
              {cvData.professionalExperiences.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium">{exp.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">
                    {exp.yearOfExperience} ans d'expérience
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Formations */}
          {cvData.educations?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Formation</h2>
              {cvData.educations.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-gray-500 text-sm">{edu.degree}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(edu.startDate).toLocaleDateString()} -{' '}
                    {edu.isCurrent ? 'Présent' : new Date(edu.endDate).toLocaleDateString()}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Langues */}
          {cvData.languages?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold border-b pb-1 mb-2">Langues</h2>
              <div className="flex flex-wrap gap-4">
                {cvData.languages.map((lang, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded">
                    <span className="font-medium">{lang.name}</span>: {lang.level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;