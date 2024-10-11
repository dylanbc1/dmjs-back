import { Controller, Get, Query, Req, Res, UseGuards } from "@nestjs/common";
import { GoogleOauthGuard } from "../guard/auth.google.guard";
import { Request, Response } from "express";
import { AuthGoogleService } from "../services/auth_google.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('auth/google')
@ApiTags('Oauth')
export class AuthGoogleController {
  constructor(private readonly authService: AuthGoogleService) {}

  @Get('callback')
  @ApiBearerAuth()
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
        //console.log(req.user)
      const token = await this.authService.oAuthLogin(req.user); 
      res.redirect(process.env.FRONT_URL+`/oauth?id=${token.id}&email=${token.email}&token=${token.token}`);
      //res.redirect('https://www.facebook.com')
      return token
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }

}