import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import PostComponentsPage, { PostDeleteDialog } from './post.page-object';
import PostUpdatePage from './post-update.page-object';
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

describe('Post e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let postComponentsPage: PostComponentsPage;
  let postUpdatePage: PostUpdatePage;
  let postDeleteDialog: PostDeleteDialog;
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

  it('should load Posts', async () => {
    await navBarPage.getEntityPage('post');
    postComponentsPage = new PostComponentsPage();
    expect(await postComponentsPage.title.getText()).to.match(/Posts/);

    expect(await postComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([postComponentsPage.noRecords, postComponentsPage.table]);

    beforeRecordsCount = (await isVisible(postComponentsPage.noRecords)) ? 0 : await getRecordsCount(postComponentsPage.table);
  });

  it('should load create Post page', async () => {
    await postComponentsPage.createButton.click();
    postUpdatePage = new PostUpdatePage();
    expect(await postUpdatePage.getPageTitle().getAttribute('id')).to.match(/gatewayApp.blogPost.home.createOrEditLabel/);
    await postUpdatePage.cancel();
  });

  it('should create and save Posts', async () => {
    await postComponentsPage.createButton.click();
    await postUpdatePage.setTitleInput('title');
    expect(await postUpdatePage.getTitleInput()).to.match(/title/);
    await postUpdatePage.setContentInput('content');
    expect(await postUpdatePage.getContentInput()).to.match(/content/);
    await postUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await postUpdatePage.getDateInput()).to.contain('2001-01-01T02:30');
    await postUpdatePage.blogSelectLastOption();
    // postUpdatePage.tagSelectLastOption();
    await waitUntilDisplayed(postUpdatePage.saveButton);
    await postUpdatePage.save();
    await waitUntilHidden(postUpdatePage.saveButton);
    expect(await isVisible(postUpdatePage.saveButton)).to.be.false;

    expect(await postComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(postComponentsPage.table);

    await waitUntilCount(postComponentsPage.records, beforeRecordsCount + 1);
    expect(await postComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Post', async () => {
    const deleteButton = postComponentsPage.getDeleteButton(postComponentsPage.records.last());
    await click(deleteButton);

    postDeleteDialog = new PostDeleteDialog();
    await waitUntilDisplayed(postDeleteDialog.deleteModal);
    expect(await postDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gatewayApp.blogPost.delete.question/);
    await postDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(postDeleteDialog.deleteModal);

    expect(await isVisible(postDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([postComponentsPage.noRecords, postComponentsPage.table]);

    const afterCount = (await isVisible(postComponentsPage.noRecords)) ? 0 : await getRecordsCount(postComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
