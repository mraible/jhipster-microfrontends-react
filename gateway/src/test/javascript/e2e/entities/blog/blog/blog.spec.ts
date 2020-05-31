import { browser, element, by } from 'protractor';

import NavBarPage from './../../../page-objects/navbar-page';
import SignInPage from './../../../page-objects/signin-page';
import BlogComponentsPage, { BlogDeleteDialog } from './blog.page-object';
import BlogUpdatePage from './blog-update.page-object';
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

describe('Blog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let blogComponentsPage: BlogComponentsPage;
  let blogUpdatePage: BlogUpdatePage;
  let blogDeleteDialog: BlogDeleteDialog;
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

  it('should load Blogs', async () => {
    await navBarPage.getEntityPage('blog');
    blogComponentsPage = new BlogComponentsPage();
    expect(await blogComponentsPage.title.getText()).to.match(/Blogs/);

    expect(await blogComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([blogComponentsPage.noRecords, blogComponentsPage.table]);

    beforeRecordsCount = (await isVisible(blogComponentsPage.noRecords)) ? 0 : await getRecordsCount(blogComponentsPage.table);
  });

  it('should load create Blog page', async () => {
    await blogComponentsPage.createButton.click();
    blogUpdatePage = new BlogUpdatePage();
    expect(await blogUpdatePage.getPageTitle().getAttribute('id')).to.match(/gatewayApp.blogBlog.home.createOrEditLabel/);
    await blogUpdatePage.cancel();
  });

  it('should create and save Blogs', async () => {
    await blogComponentsPage.createButton.click();
    await blogUpdatePage.setNameInput('name');
    expect(await blogUpdatePage.getNameInput()).to.match(/name/);
    await blogUpdatePage.setHandleInput('handle');
    expect(await blogUpdatePage.getHandleInput()).to.match(/handle/);
    await blogUpdatePage.userSelectLastOption();
    await waitUntilDisplayed(blogUpdatePage.saveButton);
    await blogUpdatePage.save();
    await waitUntilHidden(blogUpdatePage.saveButton);
    expect(await isVisible(blogUpdatePage.saveButton)).to.be.false;

    expect(await blogComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(blogComponentsPage.table);

    await waitUntilCount(blogComponentsPage.records, beforeRecordsCount + 1);
    expect(await blogComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Blog', async () => {
    const deleteButton = blogComponentsPage.getDeleteButton(blogComponentsPage.records.last());
    await click(deleteButton);

    blogDeleteDialog = new BlogDeleteDialog();
    await waitUntilDisplayed(blogDeleteDialog.deleteModal);
    expect(await blogDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gatewayApp.blogBlog.delete.question/);
    await blogDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(blogDeleteDialog.deleteModal);

    expect(await isVisible(blogDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([blogComponentsPage.noRecords, blogComponentsPage.table]);

    const afterCount = (await isVisible(blogComponentsPage.noRecords)) ? 0 : await getRecordsCount(blogComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
