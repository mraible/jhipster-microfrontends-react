import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import TagComponentsPage, { TagDeleteDialog } from './tag.page-object';
import TagUpdatePage from './tag-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../../util/utils';

const expect = chai.expect;

describe('Tag e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tagComponentsPage: TagComponentsPage;
  let tagUpdatePage: TagUpdatePage;
  let tagDeleteDialog: TagDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.loginWithOAuth('admin', 'admin');
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Tags', async () => {
    await navBarPage.getEntityPage('tag');
    tagComponentsPage = new TagComponentsPage();
    expect(await tagComponentsPage.title.getText()).to.match(/Tags/);

    expect(await tagComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([tagComponentsPage.noRecords, tagComponentsPage.table]);

    beforeRecordsCount = (await isVisible(tagComponentsPage.noRecords)) ? 0 : await getRecordsCount(tagComponentsPage.table);
  });

  it('should load create Tag page', async () => {
    await tagComponentsPage.createButton.click();
    tagUpdatePage = new TagUpdatePage();
    expect(await tagUpdatePage.getPageTitle().getAttribute('id')).to.match(/gatewayApp.blogTag.home.createOrEditLabel/);
    await tagUpdatePage.cancel();
  });

  it('should create and save Tags', async () => {
    await tagComponentsPage.createButton.click();
    await tagUpdatePage.setNameInput('name');
    expect(await tagUpdatePage.getNameInput()).to.match(/name/);
    await waitUntilDisplayed(tagUpdatePage.saveButton);
    await tagUpdatePage.save();
    await waitUntilHidden(tagUpdatePage.saveButton);
    expect(await isVisible(tagUpdatePage.saveButton)).to.be.false;

    expect(await tagComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(tagComponentsPage.table);

    await waitUntilCount(tagComponentsPage.records, beforeRecordsCount + 1);
    expect(await tagComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Tag', async () => {
    const deleteButton = tagComponentsPage.getDeleteButton(tagComponentsPage.records.last());
    await click(deleteButton);

    tagDeleteDialog = new TagDeleteDialog();
    await waitUntilDisplayed(tagDeleteDialog.deleteModal);
    expect(await tagDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gatewayApp.blogTag.delete.question/);
    await tagDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(tagDeleteDialog.deleteModal);

    expect(await isVisible(tagDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([tagComponentsPage.noRecords, tagComponentsPage.table]);

    const afterCount = (await isVisible(tagComponentsPage.noRecords)) ? 0 : await getRecordsCount(tagComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
