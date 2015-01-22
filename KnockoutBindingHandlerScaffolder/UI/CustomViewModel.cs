using Microsoft.AspNet.Scaffolding;
using Microsoft.AspNet.Scaffolding.EntityFramework;
using System.Collections.Generic;
using System.Linq;

namespace KnockoutBindingHandlerScaffolder.UI
{
    /// <summary>
    /// View model for code types so that it can be displayed on the UI.
    /// </summary>
    public class CustomViewModel
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">The code generation context</param>
        public CustomViewModel(CodeGenerationContext context)
        {
            this.Context = context;

            // we typically name our custom binding handlers like this
            this.CustomBindingHandlerName = "yourBindingHandler";

            // not sure on this one, we'll set it as a global dependency by default, if for nothing other than convenience 
            this.IncludeAsGlobalDependency = true;

            // normally we dont generate unit tests for a custom binding handler, only if we're being thorough
            this.GenerateUnitTests = false;

            // we normally don't have less files for a custom binding handler, so set this to off as default
            this.GenerateLessFile = false;

            // if we do want a less file, we'll probably want that imported
            this.ImportLessFile = true;

            this.CreateInitCallback = true;

            this.CreateUpdateCallback = false;


            this.MasterLessFilePath = @"src\css\all-components.less";

            this.UnitTestModuleLocation = @"src\test\all-tests.ts";

            this.RootPathForBindingHandler = @"src\bindingHandlers\";

            this.UnitTestCreationLocation = @"src\test\bindingHandlers\";

            this.PathForAmdDependency = @"src/app/startup.ts";
            
        }


        public string CustomBindingHandlerName { get; set; }



        #region Actions
        public bool GenerateUnitTests { get; set; }
        
        public bool GenerateLessFile { get; set; }

        public bool ImportLessFile { get; set; }

        /// <summary>
        /// adds a dependency to this binding handler inside of app/startup
        /// </summary>
        public bool IncludeAsGlobalDependency { get; set; }


        public bool CreateInitCallback { get; set; }
        public bool CreateUpdateCallback { get; set; }

        #endregion


        #region Paths
        public string UnitTestCreationLocation { get; set; }

        public string UnitTestModuleLocation { get; set; }

        /// <summary>
        /// Shown in UI as "path to put binding in"
        /// </summary>
        public string RootPathForBindingHandler { get; set; }

        /// <summary>
        /// Shown in UI as "Path to LESS file"
        /// </summary>
        public string MasterLessFilePath { get; set; }
        #endregion

        /// <summary>
        /// This is where we register our "global" dependencies
        /// </summary>
        public string PathForAmdDependency { get; set; }



        public CodeGenerationContext Context { get; private set; }



        }
}
