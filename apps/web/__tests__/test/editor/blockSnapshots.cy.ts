import { BlockSnapshotsObject } from '../../support/pageObjects/BlockSnapshotsObject';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { TableOfContentsObject } from '../../support/pageObjects/TableOfContentsObject';
import { paths } from '../../../app/utils/paths';

describe('Block Snapshots', () => {
  const snapshots = new BlockSnapshotsObject();
  const cookieBar = new CookieBarObject();
  const tableOfContents = new TableOfContentsObject();

  const mockSnapshotResponse = {
    data: [
      {
        id: 1,
        snapshotableType: 'category',
        snapshotableId: 123,
        payload: JSON.stringify({
          blocks: [
            {
              name: 'TextBlock',
              type: 'text',
              meta: { uuid: 'text-uuid-1' },
              content: { text: 'Restored snapshot text' },
            },
          ],
        }),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 2,
        snapshotableType: 'category',
        snapshotableId: 123,
        payload: JSON.stringify({
          blocks: [
            {
              name: 'OldTextBlock',
              type: 'text',
              meta: { uuid: 'old-text-uuid-1' },
              content: { text: 'Old snapshot text' },
            },
          ],
        }),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    pagination: {
      currentPage: 1,
      lastPage: 1,
      itemsPerPage: 30,
      total: 2,
    },
  };

  beforeEach(() => {
    cy.intercept('**/plentysystems/getBlockSnapshots', {
      statusCode: 200,
      body: { data: mockSnapshotResponse },
    }).as('getBlockSnapshots');

    cy.intercept('**/plentysystems/getBlockSnapshot', {
      statusCode: 200,
      body: { data: mockSnapshotResponse.data[0] },
    }).as('getBlockSnapshot');

    cy.intercept('**/plentysystems/doAddShopLogs', {
      statusCode: 200,
      body: { data: null },
    }).as('addShopLogs');

    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  describe('Snapshot Drawer', () => {
    it('should open and close the snapshot drawer', () => {
      snapshots.openSnapshotDrawer();
      snapshots.checkDrawerVisible();

      snapshots.closeSnapshotDrawer();
      snapshots.checkDrawerNotVisible();
    });

    it('should display list of snapshots', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.checkSnapshotCount(2);
    });

    it('should group snapshots by date', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.checkGroupsVisible();
    });
  });

  describe('Snapshot Filtering', () => {
    it('should filter snapshots by preset "1d"', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.selectPreset1d();
      cy.wait('@getBlockSnapshots');

      snapshots.checkSnapshotsLoaded();
    });

    it('should filter snapshots by preset "7d"', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.selectPreset7d();
      cy.wait('@getBlockSnapshots');

      snapshots.checkSnapshotsLoaded();
    });

    it('should filter snapshots by custom date range', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.setDateFrom('2025-08-01');
      cy.wait('@getBlockSnapshots');

      snapshots.checkSnapshotsLoaded();
    });
  });

  describe('Snapshot Restore', () => {
    it('should request restore of a snapshot', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.requestRestoreSnapshot(0);

      snapshots.checkRestoreConfirmationVisible();
    });

    it('should cancel restore request', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.requestRestoreSnapshot(0);
      snapshots.checkRestoreConfirmationVisible();

      snapshots.cancelRestore();

      snapshots.checkRestoreConfirmationNotVisible();
    });

    it('should restore snapshot after confirmation and reflect changes on page', () => {
      tableOfContents.openTableOfContents();
      tableOfContents.checkBlocksExist();

      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.requestRestoreSnapshot(0);
      snapshots.checkRestoreConfirmationVisible();

      snapshots.confirmRestore();
      cy.wait('@getBlockSnapshot');

      // Verify success notification appears
      snapshots.checkSnapshotRestored();

      // Close drawer and verify restored blocks are on the page
      snapshots.closeSnapshotDrawer();

      tableOfContents.openTableOfContents();
      tableOfContents.checkBlocksExist();
    });
  });

  describe('Snapshot UI States', () => {
    it('should show latest snapshot as active', () => {
      snapshots.openSnapshotDrawer();
      cy.wait('@getBlockSnapshots');

      snapshots.checkFirstSnapshotActive();
    });
  });
});
