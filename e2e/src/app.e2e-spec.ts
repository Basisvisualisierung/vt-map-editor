import { AppPage } from './app.po';
import {browser, by, element, logging} from 'protractor';

describe('workspace-project App', () => {
    let page: AppPage;
    const sleep = 0;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display Title', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Basisvisualisierung');
        browser.sleep(sleep);
    });

    it('should be possible to change color of guiLayer', () => {
        page.navigateTo();
        page.clickToolButton(1);
        page.clickDetailButton();
        page.openGuiLayerGroup(0);
        page.changeColor('100', '150', '111', '0.5');
        expect(page.getColor()).toEqual('rgba(100, 150, 111, 0.5)');
        browser.sleep(sleep);
    });

    it('should be possible to change color of layers', () => {
        page.navigateTo('/edit/layer');
        page.openLayerElement(0);
        page.changeLayerColor('#503616');
        expect(page.getColor()).toEqual('rgba(80, 54, 22, 1)' );
        browser.sleep(sleep);
    });

    it('should be possible to show tooltip on map', () => {
        page.navigateTo();
        page.clickMap(200, 750);
        expect(page.getTooltipStatus()).toBe(true);
        browser.sleep(sleep * 3);
    });

    describe('tests related to functions declaration', () => {

        it('should be possible to remove control elements from the map', () => {
            page.navigateTo('/functions');
            page.clickSlider(0);
            expect(page.getZoomControlStatus()).toBe(false);
            browser.sleep(sleep);
        });

        it('should be possible to remove function to create tooltip from the map', () => {
            page.navigateTo('/functions');
            page.clickSlider(1);
            page.clickMap(200, 750);
            expect(page.getTooltipStatus()).toBe(false);
            browser.sleep(sleep * 3);
        });

        it('should be possible to remove search from the map', () => {
            page.navigateTo('/functions');
            page.clickSlider(2);
            expect(page.getSearchStatus()).toBe(false);
            browser.sleep(sleep);
        });
    });


    describe('tests related to navigation', () => {

        it('should navigate to /basemap if basemap is selected from toolbar', () => {
            page.navigateTo();
            page.clickToolButton(0);
            expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/basemap`);
        });

        it('should navigate to /edit/group-layer if layers is selected from toolbar', () => {
            page.navigateTo();
            page.clickToolButton(1);
            expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/edit/group-layer`);
        });

        it('should navigate to /edit/gui-layer if details is selected under group-layer', () => {
            page.navigateTo();
            page.clickToolButton(1);
            page.clickDetailButton();
            expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/edit/gui-layer`);
        });

        it('should navigate to /functions if settings is selected from toolbar', () => {
            page.navigateTo();
            page.clickToolButton(2);
            expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/functions`);
        });

        it('should navigate to /share if share is selected from toolbar', () => {
            page.navigateTo();
            page.clickToolButton(3);
            expect(browser.getCurrentUrl()).toEqual(`${browser.baseUrl}/share`);
        });
    });

    afterEach(async () => {
// Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
