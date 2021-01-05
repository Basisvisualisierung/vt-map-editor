import {ComponentFixture} from '@angular/core/testing';
import {ToolBasemapComponent} from '../app/map/tools/tool-basemap/tool-basemap.component';
import {By} from '@angular/platform-browser';

export class DOMHelper<T> {
    private fixture: ComponentFixture<T>;

    constructor(fixture: ComponentFixture<T>) {
        this.fixture = fixture;
    }

    getCollection(tagName: string) {
        return this.fixture.debugElement.queryAll(By.css(tagName));
    }

    getNativeButton(tagName: string, position: number = 0): HTMLButtonElement {
        this.fixture.detectChanges();
        const nativeButton = this.fixture.debugElement.queryAll(By.css(tagName))[position].nativeElement;
        return nativeButton && nativeButton;
    }

    getLength(tagName: string): number {
        this.fixture.detectChanges();
        const elementLength = this.fixture.debugElement.queryAll(By.css(tagName)).length;
        return elementLength && elementLength;
    }

    addValue(tagName: string, position: number = 0, value: string = 'test value'){
        this.fixture.debugElement.queryAll(By.css(tagName))[position].nativeElement.value = value;
    }

    clickButton(buttonText: string): void {
        for (const button of this.getCollection('button')){
            const nativeButton: HTMLButtonElement = button.nativeElement;
            if (nativeButton.textContent === buttonText){
                nativeButton.click();
            }
        }
    }

    clickElement(tagName: string, textContent: string) {
        for (const element of this.getCollection(tagName)){
            const nativeElement: HTMLElement = element.nativeElement;
            if (nativeElement.textContent.trim() === textContent){
                console.log(nativeElement);
                nativeElement.click();
            }
        }
    }
}
