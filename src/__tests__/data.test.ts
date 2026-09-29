import { describe, it, expect } from 'vitest';
import { PROJECTS_DATA } from '../data/projectsData';
import { TECHNOLOGIES_DATA } from '../data/technologiesData';
import { PERSONAL_DATA } from '../data/personalData';
import { EXPERIMENTS_DATA } from '../data/experimentsData';
import { CERTIFICATIONS_DATA } from '../data/certificationsData';

describe('Data Integrity & Factual Accuracy Tests', () => {
  it('should have 5 core projects with complete case studies', () => {
    expect(PROJECTS_DATA.length).toBe(5);
    PROJECTS_DATA.forEach((project) => {
      expect(project.id).toBeTruthy();
      expect(project.number).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.category).toBeTruthy();
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.highlights.length).toBeGreaterThan(0);

      // Verify case study sections
      expect(project.caseStudy.problem).toBeTruthy();
      expect(project.caseStudy.approach).toBeTruthy();
      expect(project.caseStudy.systemArchitecture.length).toBeGreaterThan(0);
      expect(project.caseStudy.results).toBeTruthy();
      expect(project.caseStudy.lessonsLearned.length).toBeGreaterThan(0);
    });
  });

  it('should have Geo-Spatial project explicitly marked as RESEARCH / DEVELOPMENT', () => {
    const geoProject = PROJECTS_DATA.find((p) => p.id === 'geospatial-infrastructure');
    expect(geoProject).toBeDefined();
    expect(geoProject?.status).toBe('RESEARCH / DEVELOPMENT');
  });

  it('should have verified IT Desk certification with 30 hours duration', () => {
    expect(CERTIFICATIONS_DATA.length).toBeGreaterThan(0);
    const itDeskCert = CERTIFICATIONS_DATA.find((c) => c.provider.includes('IT Desk'));
    expect(itDeskCert).toBeDefined();
    expect(itDeskCert?.title).toBe('Data Analytics with Python');
    expect(itDeskCert?.duration).toContain('30 Hours');
    expect(itDeskCert?.period).toContain('August – September 2023');
    expect(itDeskCert?.verified).toBe(true);
  });

  it('should have valid technology constellation nodes mapped to existing projects', () => {
    const projectIds = new Set(PROJECTS_DATA.map((p) => p.id));
    // Also include portfolio-v2 and data-analytics-cert as valid system tags
    projectIds.add('portfolio-v2');
    projectIds.add('data-analytics-cert');

    TECHNOLOGIES_DATA.forEach((tech) => {
      expect(tech.name).toBeTruthy();
      expect(tech.category).toBeTruthy();
      expect(tech.description).toBeTruthy();
      // Ensure all mapped project ids exist in the dataset
      tech.projects.forEach((pid) => {
        expect(projectIds.has(pid)).toBe(true);
      });
    });
  });

  it('should have accurate personal education records for Presidency University and Lowry Adventist College', () => {
    expect(PERSONAL_DATA.education.length).toBe(2);
    const mca = PERSONAL_DATA.education.find((e) => e.degree.includes('Master of Computer Applications'));
    expect(mca).toBeDefined();
    expect(mca?.institution).toContain('Presidency University');

    const bca = PERSONAL_DATA.education.find((e) => e.degree.includes('Bachelor of Computer Applications'));
    expect(bca).toBeDefined();
    expect(bca?.institution).toContain('Lowry Adventist College');
  });

  it('should have 4 distinct lab experiments with interactive types', () => {
    expect(EXPERIMENTS_DATA.length).toBe(4);
    const types = EXPERIMENTS_DATA.map((e) => e.interactiveType);
    expect(types).toContain('latent');
    expect(types).toContain('vision');
    expect(types).toContain('audio');
    expect(types).toContain('pathfinding');
  });
});
