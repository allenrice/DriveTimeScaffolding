using Microsoft.AspNet.Scaffolding;
using Microsoft.AspNet.Scaffolding.EntityFramework;
using System.Collections.Generic;
using System.Linq;

namespace KnockoutComponentScaffolder.UI
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
            Context = context;
            this.DynamicallyLoaded = true;
            this.RegisterComponent = true;
            this.GenerateUnitTests = true;
            this.ComponentName = "new-component";
            this.ComponentLocation = @"src\components\";
            this.ComponentRegistrationLocation = @"src\app\startup.ts";
            this.UnitTestModuleLocation = @"src\test\all-tests.ts";
            this.UnitTestCreationLocation = @"src\test\components\";
            this.GenerateLessFile = true;
            this.GenerateStrippedDownComponent = false;
            this.ImportLessFile = true;
            this.MasterLessFile = @"src\css\all-components.less";
            this.PathToGulpFile = @"gulpfile.js";   
        }



        ///// <summary>
        ///// This gets all the Model types from the active project.
        ///// </summary>
        //public IEnumerable<ModelType> ModelTypes
        //{
        //    get
        //    {
        //        ICodeTypeService codeTypeService = (ICodeTypeService)Context
        //            .ServiceProvider.GetService(typeof(ICodeTypeService));

        //        return codeTypeService
        //            .GetAllCodeTypes(Context.ActiveProject)
        //            .Where(codeType => codeType.IsValidWebProjectEntityType())
        //            .Select(codeType => new ModelType(codeType));
        //    }
        //}


        public string ComponentName { get; set; }

        public bool DynamicallyLoaded { get; set; }

        public bool RegisterComponent { get; set; }

        public bool GenerateUnitTests { get; set; }

        public string ComponentLocation { get; set; }

        public string ComponentRegistrationLocation { get; set; }

        public string UnitTestCreationLocation { get; set; }

        public string UnitTestModuleLocation { get; set; }

        public bool GenerateLessFile { get; set; }

        public bool GenerateStrippedDownComponent { get; set; }

        public bool ImportLessFile { get; set; }

        public string MasterLessFile { get; set; }

        public string PathToGulpFile { get; set; }
    

        public CodeGenerationContext Context { get; private set; }



        }
}
