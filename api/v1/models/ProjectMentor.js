const Model = require('./Model');
const Project = require('./Project');
const Mentor = require('./Mentor');

const ProjectMentor = Model.extend({
  tableName: 'project_mentors',
  idAttribute: 'id',
  project: function() {
    return this.belongsTo(Project, 'project_id');
  },
  mentor: function() {
    return this.belongsTo(Mentor, 'mentor_id');
  }
});

ProjectMentor.findByProjectAndMentorId = function(project_id, mentor_id) {
  return ProjectMentor.where({
    project_id: project_id,
    mentor_id: mentor_id
  })
    .fetch();
};

module.exports = ProjectMentor;
