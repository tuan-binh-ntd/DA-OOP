using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace API.Interfaces
{
    public interface IDapper :IDisposable
    {
        DbConnection GetDbConnection();
        T Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        List<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        int Execute(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
    }
}
