using KnockoutComponentScaffolder.UI;
using Microsoft.AspNet.Scaffolding;
using System.Collections.Generic;

namespace KnockoutComponentScaffolder
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
            var fullAMDPathToComponent = string.Format("{0}/{1}/{1}", _viewModel.ComponentLocation, _viewModel.ComponentName).Replace(@"\", "/").Replace("//", "/");
            var componentLocation = string.Format(@"{0}\{1}\{1}", _viewModel.ComponentLocation, _viewModel.ComponentName).Replace("/", @"\").Replace(@"\\", @"\");
            var unitTestModulePath = string.Format(@"{0}\{1}-tests", _viewModel.UnitTestCreationLocation, _viewModel.ComponentName).Replace("/", @"\").Replace(@"\\", @"\");

            _viewModel.PathToGulpFile = _viewModel.PathToGulpFile.Replace("/", @"\").Replace(@"\\", @"\");
            _viewModel.MasterLessFile = _viewModel.MasterLessFile.Replace("/", @"\").Replace(@"\\", @"\");
            _viewModel.UnitTestModuleLocation = _viewModel.UnitTestModuleLocation.Replace("/", @"\").Replace(@"\\", @"\");



            // Setup the scaffolding item creation parameters to be passed into the T4 template.
            var parameters = new Dictionary<string, object>()
            {
                { "RegisterComponent", _viewModel.RegisterComponent }, 
                { "DynamicallyLoaded", _viewModel.DynamicallyLoaded }, 
                { "ComponentName", _viewModel.ComponentName },
                { "VariableSafeComponentName", _viewModel.ComponentName.Replace("-", "") },
                { "GenerateUnitTests", _viewModel.GenerateUnitTests },
                { "ComponentRegistrationLocation", _viewModel.ComponentRegistrationLocation },
                { "ComponentLocation", _viewModel.ComponentLocation },
                { "UnitTestCreationLocation", _viewModel.UnitTestCreationLocation },
                { "UnitTestModulePath", unitTestModulePath.Replace("src/", "") },
                { "FullPathToUnitTestModuleLocation", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.UnitTestModuleLocation).Replace("/", @"\").Replace(@"\\", @"\") },
                { "FullPathToRegistrar", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.ComponentRegistrationLocation).Replace("/", @"\").Replace(@"\\", @"\") },
                { "FullAMDPathToComponent", fullAMDPathToComponent.ToString() },
                { "FullAMDPathToComponentForRegistrar", fullAMDPathToComponent.ToString() },
                { "FullPathToMasterLessFile", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.MasterLessFile).Replace("/", @"\").Replace(@"\\", @"\") },
                { "FullPathToGulpFile", string.Format(@"{0}\{1}", Context.ActiveProject.GetFullPath(), _viewModel.PathToGulpFile).Replace("/", @"\").Replace(@"\\", @"\") },
                { "GenerateStrippedDownComponent", _viewModel.GenerateStrippedDownComponent },
                
                
                
                //You can pass more parameters after they are defined in the template
            };

            // registrar wants a slightly different path
            if (fullAMDPathToComponent.StartsWith("src/"))
            {
                parameters["FullAMDPathToComponentForRegistrar"] = fullAMDPathToComponent.Substring(4);
            }

            // Add the custom scaffolding item from T4 template.
            this.AddFileFromTemplate(Context.ActiveProject,
                componentLocation,
                "ComponentTypeScript",
                parameters,
                skipIfExists: false);

            this.AddFileFromTemplate(Context.ActiveProject,
                string.Format(@"{0}\{1}\{1}-html", _viewModel.ComponentLocation, _viewModel.ComponentName).Replace("/", @"\").Replace(@"\\", @"\"),
                //string.Concat("Scripts\\", _viewModel.ComponentName, "-html"),
                "ComponentHtml",
                parameters,
                skipIfExists: false);

            if (_viewModel.GenerateUnitTests)
            {
                // Add the custom scaffolding item from T4 template.
                this.AddFileFromTemplate(Context.ActiveProject,
                    unitTestModulePath,
                    "ComponentTestTypeScript",
                    parameters,
                    skipIfExists: false);


                this.AddFileFromTemplate(Context.ActiveProject,
                    _viewModel.UnitTestModuleLocation.Replace(".ts", ""),
                    "ComponentTestInclusion",
                    parameters,
                    skipIfExists: false);


            }

            if (_viewModel.RegisterComponent)
            {
                // Add the custom scaffolding item from T4 template.
                this.AddFileFromTemplate(Context.ActiveProject,
                    _viewModel.ComponentRegistrationLocation.Replace("/", @"\").Replace(@"\\", @"\").Replace(".ts", ""),
                    "ComponentRegistrar",
                    parameters,
                    skipIfExists: false);
            }

            if (_viewModel.RegisterComponent && _viewModel.DynamicallyLoaded)
            {
                this.AddFileFromTemplate(Context.ActiveProject,
                    _viewModel.PathToGulpFile.Replace(".js", ""),
                    "ComponentGulpModifications",
                    parameters,
                    skipIfExists: false);
            }

            if (_viewModel.GenerateLessFile)
            {
                this.AddFileFromTemplate(Context.ActiveProject,
                    componentLocation,
                    "ComponentLessFile",
                    parameters,
                    skipIfExists: false);

                if (_viewModel.ImportLessFile)
                {
                    this.AddFileFromTemplate(Context.ActiveProject,
                         _viewModel.MasterLessFile.Replace(".less", ""),
                        "ComponentLessInclusion",
                        parameters,
                        skipIfExists: false);
                }
            }
        }
    }
}
