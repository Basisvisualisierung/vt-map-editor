import { browser, by, element } from 'protractor';

export class AppPage {

    toolButtons = element.all(by.css('.tool-button'));
    detailButtons = element.all(by.css('.btn-detail'));
    colorButtons = element.all(by.css('.color-btn'));
    canvas = element.all(by.css('.mapboxgl-canvas'));
    rgbaTextField = element.all(by.css('.rgba-text'));
    rgbaInput = this.rgbaTextField.all(by.css('input'));
    okButton = element.all(by.css('.cp-ok-button-class'));
    hexTextField = element.all(by.css('.hex-text'));
    hexInput = this.hexTextField.all(by.css('input'));
    layerDropdown = element.all(by.css('.mat-expansion-panel'));
    headlineTitle = element(by.css('.header-title'));
    tooltip = element.all(by.css('.mapboxgl-popup-content'));
    zoomButton = element.all(by.css('.mapboxgl-ctrl-zoom-in'));
    searchButton = element.all(by.css('.search-control'));

    navigateTo(path: string = '') {
        return browser.get(`${browser.baseUrl}${path}`) as Promise<any>;
    }

    getTitleText() {
        return this.headlineTitle.getText();
    }

    getTooltipStatus() {
        return this.tooltip.isPresent();
    }

    getZoomControlStatus(){
        return this.zoomButton.isPresent();
    }

    getSearchStatus() {
        return this.searchButton.isPresent();
    }

    clickToolButton(index: number = 1) {
        this.toolButtons.get(index).click();
    }

    clickDetailButton() {

        this.detailButtons.get(0).click();
    }

    clickSlider(index: number) {
        element.all(by.css('.mat-slide-toggle-bar')).get(index).click();
    }

    openGuiLayerGroup(index: number = 0) {
        const guiLayerGroup = element(by.id(`mat-expansion-panel-header-${index}`));
        guiLayerGroup.click();
        browser.sleep(500);
    }

    clickColorButton(index = 0 ) {
        this.colorButtons.get(index).click();
    }

    clickMap(toRight: number, toBottom: number) {
        browser.sleep(500);
        browser.actions()
            .mouseMove(this.canvas.get(0).getWebElement(), {
                x: toRight,
                y: toBottom,
            })
            .perform().then(() => browser.actions()
                .click()
                .perform());
    }

    changeColor(r: string, g: string, b: string, a: string) {
        this.clickColorButton();
        this.rgbaInput.clear();
        this.rgbaInput.get(0).sendKeys(r);
        this.rgbaInput.get(1).sendKeys(g);
        this.rgbaInput.get(2).sendKeys(b);
        this.rgbaInput.get(3).sendKeys(a);
        this.okButton.get(0).click();
    }

    changeLayerColor(hexColor: string) {
        this.clickColorButton();
        this.hexInput.clear();
        this.hexInput.get(0).sendKeys(hexColor);
        this.okButton.get(0).click();
    }

    getColor(index: number = 0) {
        browser.sleep(500);
        return this.colorButtons.get(index).getCssValue('background-color');
    }


    openLayerElement(index: number) {
        this.layerDropdown.get(index).click();
    }
}
