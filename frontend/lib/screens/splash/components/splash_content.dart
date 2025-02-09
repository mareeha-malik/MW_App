import 'package:flutter/material.dart';
import '../../../constants.dart';

class SplashContent extends StatelessWidget {
  final String? text, image;
  final Color textColor;
  final double imageSize;

  const SplashContent({
    Key? key,
    this.text,
    this.image,
    required this.textColor,
    required this.imageSize,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        const Spacer(),
        const Text(
          "MW Sports",
          style: TextStyle(
            fontSize: 32,
            color: kPrimaryColor,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          text ?? "",
          textAlign: TextAlign.center,
          style: TextStyle(
            color: textColor,
            fontSize: 16,
          ),
        ),
        const Spacer(flex: 2),
        Image.asset(
          image ?? "",
          height: imageSize, // Using dynamic size
          width: imageSize,  // Using dynamic size
          fit: BoxFit.contain,

        ),
      ],
    );
  }
}
