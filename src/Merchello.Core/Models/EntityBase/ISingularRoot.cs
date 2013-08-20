﻿using Umbraco.Core.Models.EntityBase;

namespace Merchello.Core.Models.EntityBase
{
    /// <summary>
    /// Marker interface for singular root objects 
    /// </summary>
    /// <remarks>
    ///  This also designates the point at which Merchello looks at objects IEntity objects slightly differently
    /// than Umbraco as Merchello does not use the NodeObjectId as the Key value rather has several domain objects that use the 
    /// key as it's primary key.
    /// 
    /// TODO:  RSS - Change IAggregateRoot to IEntity when start using 7.0.0 dependencies.
    /// </remarks>
    public interface ISingularRoot : IAggregateRoot
    { }
}