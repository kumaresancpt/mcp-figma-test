namespace Backend.Models.Visitor
{
    public enum VisitorStatus
    {
        CheckIn = 0,
        Waiting = 1,
        CheckedOut = 2,
        ExpiredPass = 3,
        PendingApproval = 4
    }
}