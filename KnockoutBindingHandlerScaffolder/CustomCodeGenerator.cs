using KnockoutBindingHandlerScaffolder.UI;
using Microsoft.AspNet.Scaffolding;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace KnockoutBindingHandlerScaffolder
{
    public class CustomCodeGenerator : CodeGenerator
    {
        CustomViewModel _viewModel;

        /// <summary>
        /// Constructor for the custom code generator
        /// </summary>
        /// <param name="context">Context of the current code generation operation based on how scaffolder was invoked(such as selected project/folder) </param>
        /// <param name="information">Code generation information that is defined in the factory class.</param>
        public CustomCodeGenerator(
            CodeGenerationContext context,
            CodeGeneratorInformation information)
            : base(context, information)
        {
            _viewModel = new CustomViewModel(Context);
        }


        /// <summary>
        /// Any UI to be displayed after the scaffolder has been selected from the Add Scaffold dialog.
        /// Any validation on the input for values in the UI should be completed before returning from this method.
        /// </summary>
        /// <returns></returns>
        public override bool ShowUIAndValidate()
        {
            // Bring up the selection dialog and allow user to select a model type
            SelectModelWindow window = new SelectModelWindow(_viewModel);
            bool? showDialog = window.ShowDialog();
            return showDialog ?? false;
        }

        /// <summary>
        /// This method is executed after the ShowUIAndValidate method, and this is where the actual code generation should occur.
        /// In this example, we are generating a new file from t4 template based on the ModelType selected in our UI.
        /// </summary>
        public override void GenerateCode()
        {
            var fullAMDPathToBindingHandler = string.Format("{0}/{1}/{1}", _viewModel.RootPathForBindingHandler, _viewModel.CustomBindingHandlerName).Replace(@"\", "/").Replace("//", "/");
            var componentLocation = string.Format(@"{0}\{1}\{1}", _viewModel.RootPathForBindingHandler, _viewModel.CustomBindingHandlerName).Replace("/", @"\").Replace(@"\\", @"\");
            var unitTestModulePath = string.Format(@"{0}\{1}-tests", _viewModel.UnitTestCreationLocation, _viewModel.CustomBindingHandlerName).Replace("/", @"\").Replace(@"\\", @"\");

            _viewModel.MasterLessFilePath = _viewModel.MasterLessFilePath.Replace("/", @"\").Replace(@"\\", @"\");
            _viewModel.UnitTestModuleLocation = _viewModel.UnitTestModuleLocation.Replace("/", @"\").Replace(@"\\", @"\");


            
            // Setup the scaffolding item creation parameters to be passed into the T4 template.
            var parameters = new Dictionary<string, object>()
            {

                { "CreateUpdateCallback", _viewModel.CreateUpdateCallback },
                { "CreateInitCallback", _viewModel.CreateInitCallback },
                
                { "VariableSafeCustomBindingHandlerName", _viewModel.CustomBindingHandlerName.Replace("-", "") },
                { "CustomBindingHandlerName", _viewModel.CustomBindingHandlerName },
                { "GenerateUnitTests", _viewModel.GenerateUnitTests },
                { "PathForAmdDependency", _viewModel.PathForAmdDependency},
                { "RootPathForBindingHandler", _viewModel.RootPathForBindingHandler },
                { "UnitTestCreationLocation", _viewModel.UnitTestCreationLocation },
                { "UnitTestModulePath", unitTestModulePath.Replace("src/", "") },
                { "FullPathToUnitTestModuleLocation", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.UnitTestModuleLocation).Replace("/", @"\").Replace(@"\\", @"\") },
                { "FullPathForAmdDependency", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.PathForAmdDependency).Replace("/", @"\").Replace(@"\\", @"\") },

                // see if we can get this down to just 1
                
                { "FullAMDPathToComponentForRegistrar", fullAMDPathToBindingHandler.StartsWith("src/") ? fullAMDPathToBindingHandler.Substring(4) : fullAMDPathToBindingHandler },
                { "FullPathToMasterLessFile", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.MasterLessFilePath).Replace("/", @"\").Replace(@"\\", @"\") },
                
                //You can pass more parameters after they are defined in the template
            };

            // Add the custom scaffolding item from T4 template.
            this.AddFileFromTemplate(Context.ActiveProject,
                componentLocation,
                "BindingHandlerTypeScript",
                parameters,
                skipIfExists: false);

            if (_viewModel.GenerateUnitTests)
            {
                // Add the custom scaffolding item from T4 template.
                this.AddFileFromTemplate(Context.ActiveProject,
                    unitTestModulePath,
                    "BindingHandlerTestTypeScript",
                    parameters,
                    skipIfExists: false);


                this.AddFileFromTemplate(Context.ActiveProject,
                    _viewModel.UnitTestModuleLocation.Replace(".ts", ""),
                    "BindingHandlerTestInclusion",
                    parameters,
                    skipIfExists: false);
            }

            if (_viewModel.IncludeAsGlobalDependency)
            {
                // Add the custom scaffolding item from T4 template.
                this.AddFileFromTemplate(Context.ActiveProject,
                    _viewModel.PathForAmdDependency.Replace("/", @"\").Replace(@"\\", @"\").Replace(".ts", ""),
                    "AmdDependencyInclusion",
                    parameters,
                    skipIfExists: false);
            }


            if (_viewModel.GenerateLessFile)
            {
                this.AddFileFromTemplate(Context.ActiveProject,
                    componentLocation,
                    "BindingHandlerLessFile",
                    parameters,
                    skipIfExists: false);

                if (_viewModel.ImportLessFile)
                {
                    this.AddFileFromTemplate(Context.ActiveProject,
                         _viewModel.MasterLessFilePath.Replace(".less", ""),
                        "BindingHandlerLessInclusion",
                        parameters,
                        skipIfExists: false);
                }
            }
        }
    }
}
