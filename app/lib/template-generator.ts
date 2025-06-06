import { EnhancedResume } from './resume-enhancer';

export function generateHTMLResume(data: EnhancedResume): string {
  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 40px 20px; 
      background: white; 
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px; 
      padding-bottom: 20px; 
      border-bottom: 1px solid #e5e5e5; 
    }
    .header h1 { 
      font-size: 32px; 
      font-weight: 600; 
      margin-bottom: 8px; 
      color: #1a1a1a; 
    }
    .header .title { 
      font-size: 18px; 
      color: #666; 
      margin-bottom: 16px; 
    }
    .contact { 
      font-size: 14px; 
      color: #666; 
      display: flex; 
      justify-content: center; 
      gap: 20px; 
      flex-wrap: wrap; 
    }
    .contact a { color: #666; text-decoration: none; }
    .section { margin-bottom: 32px; }
    .section h2 { 
      font-size: 20px; 
      font-weight: 600; 
      color: #1a1a1a; 
      margin-bottom: 16px; 
      text-transform: uppercase; 
      letter-spacing: 0.5px; 
    }
    .summary { font-size: 16px; line-height: 1.7; color: #444; }
    .job { 
      margin-bottom: 24px; 
      padding-bottom: 20px; 
      border-bottom: 1px solid #f0f0f0; 
    }
    .job:last-child { border-bottom: none; margin-bottom: 0; }
    .job-header { margin-bottom: 12px; }
    .job-title { 
      font-size: 18px; 
      font-weight: 600; 
      color: #1a1a1a; 
      margin-bottom: 4px; 
    }
    .company-duration { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 8px; 
    }
    .company { font-size: 16px; font-weight: 500; color: #333; }
    .duration { font-size: 14px; color: #666; }
    .location { font-size: 14px; color: #666; font-style: italic; }
    .achievements { margin-top: 8px; }
    .achievements ul { list-style: none; padding-left: 0; }
    .achievements li { 
      margin-bottom: 6px; 
      padding-left: 16px; 
      position: relative; 
      font-size: 15px; 
      line-height: 1.5; 
    }
    .achievements li:before { 
      content: "•"; 
      position: absolute; 
      left: 0; 
      color: #666; 
    }
    .tech-stack { margin-top: 8px; font-size: 14px; color: #666; }
    .tech-stack strong { color: #333; }
    .skills-section { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
      gap: 24px; 
      margin-top: 16px; 
    }
    .skill-group h3 { 
      font-size: 16px; 
      font-weight: 600; 
      color: #1a1a1a; 
      margin-bottom: 8px; 
    }
    .skill-list { font-size: 14px; line-height: 1.6; color: #444; }
    .education-item { margin-bottom: 16px; }
    .education-title { 
      font-size: 16px; 
      font-weight: 600; 
      color: #1a1a1a; 
      margin-bottom: 4px; 
    }
    .education-school { 
      font-size: 15px; 
      color: #333; 
      margin-bottom: 2px; 
    }
    .education-duration { 
      font-size: 14px; 
      color: #666; 
      margin-bottom: 6px; 
    }
    .education-description { 
      font-size: 14px; 
      color: #444; 
      line-height: 1.5; 
    }
    .languages { font-size: 15px; color: #444; }
    @media (max-width: 600px) { 
      body { padding: 20px 15px; } 
      .contact { flex-direction: column; gap: 8px; } 
      .company-duration { 
        flex-direction: column; 
        align-items: flex-start; 
        gap: 4px; 
      } 
      .skills-section { grid-template-columns: 1fr; gap: 16px; } 
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name} - ${data.personalInfo.title}</title>
    <style>${css}</style>
</head>
<body>
    <div class="header">
        <h1>${data.personalInfo.name}</h1>
        <div class="title">${data.personalInfo.title}</div>
        <div class="contact">
            ${data.personalInfo.location ? `<span>${data.personalInfo.location}</span>` : ''}
            ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
            ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a>` : ''}
            ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank">LinkedIn</a>` : ''}
            ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank">GitHub</a>` : ''}
        </div>
    </div>

    <div class="section">
        <h2>Summary</h2>
        <div class="summary">${data.summary}</div>
    </div>

    <div class="section">
        <h2>Experience</h2>
        ${data.experience.map(job => `
            <div class="job">
                <div class="job-header">
                    <div class="job-title">${job.title}</div>
                    <div class="company-duration">
                        <div class="company">${job.company}</div>
                        <div class="duration">${job.duration}</div>
                    </div>
                    ${job.location ? `<div class="location">${job.location}</div>` : ''}
                </div>
                <div class="achievements">
                    <ul>
                        ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
                ${job.technologies.length > 0 ? `
                    <div class="tech-stack">
                        <strong>Technologies:</strong> ${job.technologies.join(', ')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Technical Skills</h2>
        <div class="skills-section">
            ${Object.entries(data.skills)
              .filter(([_, skills]) => skills.length > 0)
              .map(([category, skills]) => `
                <div class="skill-group">
                    <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <div class="skill-list">
                        ${skills.join('<br>')}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    ${data.education.length > 0 ? `
        <div class="section">
            <h2>Education</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <div class="education-title">${edu.degree}</div>
                    <div class="education-school">${edu.school}</div>
                    <div class="education-duration">${edu.duration}</div>
                    ${edu.description ? `<div class="education-description">${edu.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
    ` : ''}

    ${data.languages.length > 0 ? `
        <div class="section">
            <h2>Languages</h2>
            <div class="languages">
                ${data.languages.join(', ')}
            </div>
        </div>
    ` : ''}
</body>
</html>`;
}