module.exports = {
  type: {
    Job: false
  },
  query: `
    jobs (sort: String, limit: Int, start: Int, where: JSON): [Job!]!
    jobBySlug (slug: String!, publicationState: PublicationState): Job
  `,
  resolver: {
    Query: {
      jobs: {
        description: "Return all job",
        resolver: "application::job.job.findGQL"
      },
      jobBySlug: {
        description: "Return job by slug",
        resolver: "application::job.job.findOneBySlug"
      }
    }
  }
};
