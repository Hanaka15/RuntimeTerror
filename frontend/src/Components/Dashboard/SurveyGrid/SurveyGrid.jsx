import React from 'react';
import './SurveyGrid.scss';

const SurveyCard = ({ title, description, Completions, status }) => {
    return (
        <div className="survey-card">
            <h3 className="survey-title">{title}</h3>
            <p className="survey-description">{description}</p>
            <div className="survey-stats">
                <span>{Completions} Completions</span>
                <span>{status}</span>
            </div>
        </div>
    );
};

const SurveyGrid = () => {
    const placeholderSurveys = [
        {
            title: "What text is AI Generated?",
            description: "Can you tell what text is AI generated?",
            Completions: "24",
            status: "Active"
        },
        {
            title: "AI Image quiz",
            description: "What image is AI generated?",
            Completions: "15",
            status: "Active"
        },
        {
            title: "Multiple Choice Quiz",
            description: "Can you tell what images and texts are AI generated?",
            Completions: "32",
            status: "Closed"
        },
        {
            title: "Super duper quiz",
            description: "Test your mega skillz",
            Completions: "69",
            status: "Active"
        },
        {
            title: "AI Detection Challenge",
            description: "Test your ability to spot AI-generated content",
            Completions: "45",
            status: "Active"
        },
        {
            title: "Content Analysis Quiz",
            description: "Analyze and identify AI-generated content",
            Completions: "28",
            status: "Active"
        },
        {
            title: "Text Generation Quiz",
            description: "Identify AI-generated text patterns",
            Completions: "37",
            status: "Closed"
        },
        {
            title: "Image Recognition Test",
            description: "Spot the differences between AI and human-created images",
            Completions: "420",
            status: "Active"
        }
    ];

    return (
        <div className="survey-grid">
            {placeholderSurveys.map((survey, index) => (
                <SurveyCard key={index} {...survey} />
            ))}
        </div>
    );
};

export default SurveyGrid; 