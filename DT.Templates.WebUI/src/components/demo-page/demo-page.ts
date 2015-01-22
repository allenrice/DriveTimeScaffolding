/// <amd-dependency path="text!./demo-page-html.html" />
/// <reference path="../../require.d.ts" />
/// <reference path="../../TypeLite.Net4.d.ts" />

import $ = require("jquery");
import ko = require("knockout");
import parent = require("components/demo-application/demo-application");
export var template: string = require("text!./demo-page-html.html");

export class viewModel {
    
    constructor(params: parent.viewModel) {

        this.exampleData(params.exampleData);

        this.startAnimation(false);
        
    }

    /** showing an example of having a complex type from C# in your KO VM */
    exampleData: KnockoutObservable<DT.Templates.WebUI.Models.TypeLiteDemoClass> = ko.observable(null);


    runAjaxRequest = () => {

        $.ajax({
            url: "/api/test",
            data: this.exampleData(),
            type: "POST",
            success: (response: DT.Templates.WebUI.Models.TypeLiteDemoClass) => {

                // testing out some of the strong typing 
                console.log("Result from the server", response.ListProperty);

                this.exampleData(response);

            }
        });
    }

    /** the current frame of the animated sprite */
    currentFrame = ko.observable(1);

    /** the handle used to clear the interval generated via setInterval */
    animationIntervalHandle: number;

    /** the delay passed to setInterval when animating the sprite */
    animationSpeed = 50;

    /** the interval by which we can increase and decrease the animation speed */
    animationSpeedInterval = 5;

    slowAnimation = () => {
        this.animationSpeed = this.animationSpeed + this.animationSpeedInterval;
        this.startAnimation(true);
    }

    speedAnimation = () => {
        this.animationSpeed = this.animationSpeed - this.animationSpeedInterval;
        this.startAnimation(true);
    }

    startAnimation = (stopFirst: boolean) => {

        if (stopFirst) {
            window.clearInterval(this.animationIntervalHandle);
        }

        this.animationIntervalHandle = window.setInterval(() => {

            var current = this.currentFrame();

            if (current === 16) {
                current = 1;
            } else {
                current++;
            }

            this.currentFrame(current);

        }, this.animationSpeed);
    }

    dispose = () => {
        // make sure that we clear the interval
        window.clearInterval(this.animationIntervalHandle);
    }
}
