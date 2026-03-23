// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    const newPermissions = [
      'api::hero-image.hero-image.find',
      'api::hero-image.hero-image.findOne',
      'api::site-content.site-content.find',
      'api::site-content.site-content.findOne',
      'api::event.event.find',
      'api::event.event.findOne',
      'api::registration.registration.create',
      'api::gallery.gallery.find',
      'api::gallery.gallery.findOne',
      'api::team-member.team-member.find',
      'api::team-member.team-member.findOne',
      'api::project.project.find',
      'api::project.project.findOne',
    ];

    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.documentId || publicRole.id } }); // Using documentId for strapi v5

    for (const action of newPermissions) {
      const exists = existingPermissions.find((p) => p.action === action);
      if (!exists) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: publicRole.documentId || publicRole.id,
          },
        });
      }
    }
  },
};
