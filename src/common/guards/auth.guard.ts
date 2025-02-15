import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.split(" ")[1]; // Extract token (Bearer <token>)
    try {
      const decoded = this.jwtService.verify(token);
      console.log("decoded", decoded);
      req.user = decoded; // Attach user info to request
      return true;
    } catch (err) {
      return false;
    }
  }
}
