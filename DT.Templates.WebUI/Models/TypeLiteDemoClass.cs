using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DT.Templates.WebUI.Models
{
    public class TypeLiteDemoClass
    {
        public TypeLiteDemoEnum MyProperty { get; set; }

        public List<string> ListProperty { get; set; }

        public int NumberProperty { get; set; }

        public bool BoolProperty { get; set; }

    }

    public enum TypeLiteDemoEnum
    {
        First = 0,
        Second = 1,
        Third = 2
    }
}