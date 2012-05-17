var Demo = Em.Application.create();


Demo.Site = Em.Object.extend({
    url: null,
    name: null,
    id: null,
    visits: null
});


Demo.demoController = Em.ArrayProxy.create({
    content: [],
    isError: false,
    increment: 1,
    currentSite: undefined,
    triggerError: function () {
        this.set('isError', true);
    },
    updateCurrentSite: function () {
        this.set('currentSite', this.findProperty('id', id));
    },
    clearAll: function() {
        this.clear();
        this.set('currentSite', undefined);
        this.set('isError', false);
    },
    addOne: function (){
        this.addSite('http://one-site' + this.get('increment') + '.com',
            'One Site #' + this.get('increment'), this.get('increment'));
    },
    addMany: function() {
        for (i=0; i<5; i++) {
            this.addSite('http://some-site' + this.get('increment') + '.com',
                'Some Site #' + this.get('increment'), this.get('increment'));
        }
    },
    addSite: function(url, name, id) {
        var site = Demo.Site.create({
            url: url,
            name: name,
            id: id,
            visits: parseInt(Math.random()*1000, 10)
        });
        this.pushObject(site);
        this.set('increment', this.get('increment') + 1);
    },
    removeLast: function() {
        this.popObject();
    },
    computeMax: function (property) {
        if (this.get('length') <= 0) {
            return "";
        }
        var max = -1;
        this.forEach(function(site) {
            if (site.get(property).length > max) {
                max = site.get(property).length;
            }
        });
        return max;
    },
    // properties
    longestNameLength: function() {
        return this.computeMax('name');
    }.property('@each.name'),
    longestUrlLength: function () {
        return this.computeMax('url');
    }.property('@each.url'),
    currentSiteUnSet: function() {
        if (this.get('currentSite') === undefined) {
            return true;
        }
        return false;
    }.property('currentSite')
});

Demo.summaryView = Em.View.extend({
    countBinding: 'Demo.demoController.length',
    longestNameBinding: 'Demo.demoController.longestNameLength',
    longestUrlBinding: 'Demo.demoController.longestUrlLength'
});

Demo.siteDetailsView = Em.View.extend({
    nameBinding: 'Demo.demoController.currentSite.name',
    urlBinding: 'Demo.demoController.currentSite.url',
    visitsBinding: 'Demo.demoController.currentSite.visits',
    siteUnSetBinding: 'Demo.demoController.currentSiteUnSet'
});


Demo.siteListItemView = Em.View.extend({
    changeCurrentSite: function (event) {
        id = event.view.content.get('id');
        Demo.demoController.updateCurrentSite(id);
        this.siteSet = true;
    }
});

Demo.errorView = Em.View.extend({
    isErrorBinding: 'Demo.demoController.isError'
});

//Let's add two site to start with
Demo.demoController.addSite(
    'http://some-site' + Demo.demoController.get('increment') + '.com',
    'Some Site', Demo.demoController.get('increment'));
Demo.demoController.addSite(
    'http://another-site' + Demo.demoController.get('increment') + '.com',
    'Another Site', Demo.demoController.get('increment'));
