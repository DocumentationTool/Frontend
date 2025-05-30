'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">document-web documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminComponent.html" data-type="entity-link" >AdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditorComponent.html" data-type="entity-link" >EditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupAddComponent.html" data-type="entity-link" >GroupAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupEditComponent.html" data-type="entity-link" >GroupEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupPermissionAddComponent.html" data-type="entity-link" >GroupPermissionAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupPermissionUpdateComponent.html" data-type="entity-link" >GroupPermissionUpdateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MainComponent.html" data-type="entity-link" >MainComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RepoEditTagsComponent.html" data-type="entity-link" >RepoEditTagsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResourceCreateNewComponent.html" data-type="entity-link" >ResourceCreateNewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResourceEditTagsComponent.html" data-type="entity-link" >ResourceEditTagsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResourceMoveComponent.html" data-type="entity-link" >ResourceMoveComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResourceUploadComponent.html" data-type="entity-link" >ResourceUploadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarComponent.html" data-type="entity-link" >SidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TreeChildComponent.html" data-type="entity-link" >TreeChildComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserAddComponent.html" data-type="entity-link" >UserAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserEditComponent.html" data-type="entity-link" >UserEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserPermissionAddComponent.html" data-type="entity-link" >UserPermissionAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserPermissionUpdateComponent.html" data-type="entity-link" >UserPermissionUpdateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewComponent.html" data-type="entity-link" >ViewComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ResizableDirective.html" data-type="entity-link" >ResizableDirective</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiAuth.html" data-type="entity-link" >ApiAuth</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiGroup.html" data-type="entity-link" >ApiGroup</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiRepo.html" data-type="entity-link" >ApiRepo</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiResource.html" data-type="entity-link" >ApiResource</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApiUser.html" data-type="entity-link" >ApiUser</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupService.html" data-type="entity-link" >GroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResizeService.html" data-type="entity-link" >ResizeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResourceService.html" data-type="entity-link" >ResourceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ApiResponseFileTree.html" data-type="entity-link" >ApiResponseFileTree</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseGetPermission.html" data-type="entity-link" >ApiResponseGetPermission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseGroup.html" data-type="entity-link" >ApiResponseGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseLogin.html" data-type="entity-link" >ApiResponseLogin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseModel.html" data-type="entity-link" >ApiResponseModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseModelDocumentContent.html" data-type="entity-link" >ApiResponseModelDocumentContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseModelRepos.html" data-type="entity-link" >ApiResponseModelRepos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseModelResourceBeingEdited.html" data-type="entity-link" >ApiResponseModelResourceBeingEdited</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseResource.html" data-type="entity-link" >ApiResponseResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseTags.html" data-type="entity-link" >ApiResponseTags</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponseUser.html" data-type="entity-link" >ApiResponseUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContentGroup.html" data-type="entity-link" >ContentGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Group.html" data-type="entity-link" >Group</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Permission.html" data-type="entity-link" >Permission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Repos.html" data-type="entity-link" >Repos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Resources.html" data-type="entity-link" >Resources</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserPermission.html" data-type="entity-link" >UserPermission</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});